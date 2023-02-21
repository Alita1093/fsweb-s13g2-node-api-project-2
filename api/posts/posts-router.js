// post routerları buraya yazın
const express = require("express");
const Posts = require("./posts-model");
const router = express.Router();

router.get("/", (req, res) => {
  Posts.find()
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((err) => {
      res.status(500).json({ message: "Gönderiler alınamadı" });
    });
});
// Get Post By id
router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then((singlepost) => {
      if (!singlepost) {
        res
          .status(404)
          .json({ message: "Belirtilen ID'li gönderi bulunamadı" });
      } else {
        res.status(200).json(singlepost);
      }
    })
    .catch(() => {
      res.status(500).json({ message: "Gönderi bilgisi alınamadı" });
    });
});
//Create a Post via title and contents
router.post("/", (req, res) => {
  let addPost = req.body;
  console.log(addPost);
  if (!addPost.title || !addPost.contents) {
    res
      .status(400)
      .json({ message: "Lütfen gönderi için bir title ve contents sağlayın" });
  } else {
    Posts.insert(addPost)
      .then((newPost) => {
        res.status(201).json(newPost);
      })
      .catch(() => {
        res
          .status(500)
          .json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
      });
  }
});
// Edit Post

router.put("/:id", async (req, res) => {
  try {
    let updatedPost = await Posts.findById(req.params.id);
    console.log(updatedPost);
    if (!updatedPost) {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    } else {
      if (!updatedPost.title || !updatedPost.contents) {
        res
          .status(400)
          .json({ message: "Lütfen gönderi için title ve contents sağlayın" });
      } else {
        let updatedPostS = await Posts.update(req.params.id, req.body);
        res.status(200).json(updatedPostS);
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Gönderi bilgileri güncellenemedi" });
  }
});
// Delete Post
router.delete("/:id", async (req, res) => {
  try {
    let DeletedUser = await Posts.findById(req.params.id);
    if (!DeletedUser) {
      res.status(404).json({ message: "Belirtilen ID li gönderi bulunamadı" });
    } else {
      await Posts.remove(req.params.id);
      res.status(200).json(DeletedUser);
    }
  } catch (error) {
    res.status(500).json({ message: "Gönderi silinemedi" });
  }
});
router.get("/:id/comments", async (req, res) => {
  try {
    let post = await Posts.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "Girilen ID'li gönderi bulunamadı." });
    } else {
      let comments = await Posts.findPostComments(req.params.id);
      res.status(200).json(comments);
    }
  } catch (error) {
    res.status(500).json({ message: "Yorumlar bilgisi getirilemedi" });
  }
});
module.exports = router;
