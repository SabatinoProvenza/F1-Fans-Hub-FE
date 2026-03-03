import { useParams } from "react-router-dom"

export default function ArticleDetail() {
  const { id } = useParams()

  return (
    <div className="container py-5">
      <h1>Article Detail</h1>
      <p>ID articolo: {id}</p>
    </div>
  )
}
