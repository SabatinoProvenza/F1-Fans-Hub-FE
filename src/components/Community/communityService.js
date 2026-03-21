const BASE_URL = "https://considerable-ilise-me-stesso-f977c3cb.koyeb.app"

// ---------------- POSTS ----------------

export const getPosts = async (token, page = 0, size = 10) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  const res = await fetch(`${BASE_URL}/post?page=${page}&size=${size}`, {
    headers,
  })

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
    if (res.status === 413) {
      throw new Error(
        "L'immagine è troppo pesante. Scegli un file più piccolo.",
      )
    }

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
    if (res.status === 413) {
      throw new Error(
        "L'immagine è troppo pesante. Scegli un file più piccolo.",
      )
    }

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

export const getComments = async (postId, page = 0, size = 5) => {
  const res = await fetch(
    `${BASE_URL}/post/${postId}/comments?page=${page}&size=${size}`,
  )

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
