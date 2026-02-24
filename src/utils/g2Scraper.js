
const SCRAPEDO_TOKEN = "40ed158f960244e1955bf94c8f9ce6a27ceb2b8cd3f"; // Ideally move to .env
const SCRAPEDO_ENDPOINT = "https://api.scrape.do";
const MAX_PAGES = 2;

/**
 * Converts a class string like "stars-9" to a rating number (4.5)
 */
const convertRating = (classString) => {
    if (!classString) return 0;
    const match = classString.match(/stars-(\d+)/);
    if (match) {
        return parseInt(match[1]) / 2;
    }
    return 0;
};

/**
 * Fetches HTML from Scrape.do
 */
const fetchWithScrapeDo = async (targetUrl) => {
    const params = new URLSearchParams({
        token: SCRAPEDO_TOKEN,
        url: targetUrl,
        render: "true",
        geoCode: "us",
        super: "true"
    });

    const response = await fetch(`${SCRAPEDO_ENDPOINT}?${params.toString()}`);
    if (!response.ok) {
        throw new Error(`Scrape.do failed with status: ${response.status}`);
    }
    return await response.text();
};

/**
 * Main scraper function
 * @param {string} baseUrl - The G2 product URL (e.g., "https://www.g2.com/products/druva/reviews")
 * @param {function} onProgress - Callback to update progress (optional)
 */
export const scrapeG2Reviews = async (baseUrl, onProgress) => {
    let allReviews = [];
    
    // Ensure URL has query param key if needed, or handle pagination manually
    // The python script appended "?survey_responses_page={page}"
    // We need to support base URLs that might or might not have query params.
    
    // Construct base paging URL. 
    // If user pastes "https://www.g2.com/products/xyz/reviews", we append "?survey_responses_page="
    
    // Simple check: does it have ?
    const separator = baseUrl.includes('?') ? '&' : '?';
    const pagingBase = `${baseUrl}${separator}survey_responses_page=`;

    for (let page = 1; page <= MAX_PAGES; page++) {
        const pageUrl = `${pagingBase}${page}`;
        
        if (onProgress) onProgress(`Scraping page ${page} of ${MAX_PAGES}...`);
        
        try {
            const html = await fetchWithScrapeDo(pageUrl);
            
            // Parse HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            
            // Select review blocks (matching Python logic: #reviews-result .elv-border)
            // Note: In browser DOM, we might need slightly different selectors if structure is complex, 
            // but standard CSS selectors work.
            const reviewBlocks = doc.querySelectorAll("#reviews-result .elv-border"); // This might match too many generic borders? 
            // Python used: soup.select("#reviews-result .elv-border")
            
            if (reviewBlocks.length === 0) {
                console.warn(`No reviews found on page ${page}. Stopping.`);
                break; 
            }

            reviewBlocks.forEach(block => {
                const nameTag = block.querySelector("h5.elv-font-semibold");
                const titleTag = block.querySelector("h4 a");
                const descTag = block.querySelector("div.elv-my-4"); // Review body
                const ratingTag = block.querySelector("div.stars");
                // Date tag selector from Python: "div.elv-flex.elv-justify-between > span"
                // This is very specific. Let's try to match it.
                // In JS querySelector, direct child > works.
                // Try to find avatar image
                const imgTag = block.querySelector("img"); 
                let avatarUrl = "";
                if (imgTag) {
                     // Prioritize data-src (lazy load)
                     const possibleUrl = imgTag.getAttribute('data-src') || imgTag.getAttribute('src');
                     if (possibleUrl && !possibleUrl.includes('spacer')) {
                         avatarUrl = possibleUrl;
                     }
                }

                const name = nameTag ? nameTag.textContent.trim() : "Anonymous";
                const title = titleTag ? titleTag.textContent.trim() : "";
                const description = descTag ? descTag.textContent.trim() : "";
                const date = dateTag ? dateTag.textContent.trim() : new Date().toISOString();
                
                let rating = 0;
                if (ratingTag) {
                    rating = convertRating(ratingTag.className);
                }

                if (name || title || description) {
                    allReviews.push({
                        author: name,         
                        role: title,          
                        content: description, 
                        rating: rating,
                        source: 'G2',
                        date: date,
                        avatar: avatarUrl, // Use extracted avatar
                        importedAt: new Date().toISOString()
                    });
                }
            });

        } catch (error) {
            console.error(`Error scraping page ${page}:`, error);
            // Don't break completely, try next page? Or stop? 
            // Usually if one fails, network might be down.
        }
    }

    return allReviews;
};
