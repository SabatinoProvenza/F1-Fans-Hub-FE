import ArticleRow from "../components/ArticleRaw/ArticleRaw"

const articles = [
  {
    id: "1",
    title: "Ferrari brings major upgrades to Imola",
    excerpt: `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
nisi ut aliquip ex ea commodo consequat.
`,
    imageUrl: "https://picsum.photos/1000/700?random=11",
    source: {
      name: "Motorsport Weekly",
      url: "https://example.com/article1",
    },
    publishedAt: "2026-03-03T10:22:00Z",
    category: "teams",
    url: "https://example.com/article1",
  },
  {
    id: "2",
    title: "Verstappen dominates under the lights in Bahrain",
    excerpt: `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
nisi ut aliquip ex ea commodo consequat.
`,
    imageUrl: "https://picsum.photos/1000/700?random=12",
    source: {
      name: "Race Hub",
      url: "https://example.com/article2",
    },
    publishedAt: "2026-03-02T18:45:00Z",
    category: "races",
    url: "https://example.com/article2",
  },
  {
    id: "3",
    title: "Mercedes focusing on long-term development strategy",
    excerpt: `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
nisi ut aliquip ex ea commodo consequat.
`,
    imageUrl: "https://picsum.photos/1000/700?random=13",
    source: {
      name: "F1 Insights",
      url: "https://example.com/article3",
    },
    publishedAt: "2026-03-01T14:10:00Z",
    category: "teams",
    url: "https://example.com/article3",
  },
  {
    id: "4",
    title: "Rookie driver surprises with top-five finish",
    excerpt: `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
nisi ut aliquip ex ea commodo consequat.
`,
    imageUrl: "https://picsum.photos/1000/700?random=14",
    source: {
      name: "Grid News",
      url: "https://example.com/article4",
    },
    publishedAt: "2026-02-28T09:30:00Z",
    category: "drivers",
    url: "https://example.com/article4",
  },
]

export default function NewsSection() {
  return (
    <section>
      <div className="container">
        <h2 className="display-5 fw-bold mb-4">BREAKING NEWS IN F1</h2>
      </div>

      {articles.map((a, index) => (
        <ArticleRow
          key={a.id}
          article={a}
          reverse={index % 2 === 1} // alterna: 0 normale, 1 reverse, 2 normale...
        />
      ))}
    </section>
  )
}
