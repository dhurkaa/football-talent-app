const FEED_URL = "https://feeds.bbci.co.uk/sport/football/premier-league/rss.xml";

const decodeEntities = (value = "") =>
  value
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

const extractTag = (source, tag) => {
  const match = source.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? decodeEntities(match[1].trim()) : "";
};

const stripHtml = (value = "") => value.replace(/<[^>]+>/g, "").trim();

const getPremierLeagueNews = async (limit = 6) => {
  const response = await fetch(FEED_URL, {
    headers: {
      "User-Agent": "FootballTalentApp/1.0"
    }
  });

  if (!response.ok) {
    throw new Error(`Premier League news feed returned ${response.status}`);
  }

  const xml = await response.text();
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)]
    .map((match) => {
      const item = match[1];
      return {
        title: extractTag(item, "title"),
        link: extractTag(item, "link"),
        pubDate: extractTag(item, "pubDate"),
        description: stripHtml(extractTag(item, "description")),
        guid: extractTag(item, "guid"),
        sourceName: "BBC Sport Premier League"
      };
    })
    .filter(
      (item) =>
        item.title &&
        item.link &&
        item.title.toLowerCase() !== "find out more here" &&
        /\/sport\/football\//.test(item.link)
    )
    .slice(0, limit);

  return items;
};

module.exports = { getPremierLeagueNews };
