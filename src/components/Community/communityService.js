const BASE_URL = "http://localhost:8080"

// ---------------- POSTS ----------------

export const getPosts = async (token) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  const res = await fetch(`${BASE_URL}/post`, { headers })

  if (!res.ok) {
    throw new Error("Errore nel caricamento dei post")
  }

  return res.json()
}

export const createPost = async (token, formData) => {
  const res = await fetch(`${BASE_URL}/post`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!res.ok) {
    throw new Error("Errore nella creazione del post")
  }

  return res.json()
}

export const updatePost = async (token, postId, formData) => {
  const res = await fetch(`${BASE_URL}/post/${postId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!res.ok) {
    throw new Error("Errore durante la modifica del post")
  }

  return res.json()
}

export const deletePost = async (token, postId) => {
  const res = await fetch(`${BASE_URL}/post/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error("Errore durante l'eliminazione del post")
  }
}

// ---------------- LIKE ----------------

export const toggleLike = async (token, post) => {
  const res = await fetch(`${BASE_URL}/post/${post.id}/like`, {
    method: post.likedByCurrentUser ? "DELETE" : "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error("Errore durante il like")
  }

  return res.json()
}

// ---------------- COMMENTS ----------------

export const getComments = async (postId) => {
  const res = await fetch(`${BASE_URL}/post/${postId}/comments`)

  if (!res.ok) {
    throw new Error("Errore nel caricamento dei commenti")
  }

  return res.json()
}

export const createComment = async (token, postId, content) => {
  const res = await fetch(`${BASE_URL}/post/${postId}/comments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  })

  if (!res.ok) {
    throw new Error("Errore nella creazione del commento")
  }

  return res.json()
}

export const updateComment = async (token, commentId, content) => {
  const res = await fetch(`${BASE_URL}/comments/${commentId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  })

  if (!res.ok) {
    throw new Error("Errore durante la modifica del commento")
  }

  return res.json()
}

export const deleteComment = async (token, commentId) => {
  const res = await fetch(`${BASE_URL}/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error("Errore durante l'eliminazione del commento")
  }
}
