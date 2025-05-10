const  Post= require("../models/postModels");
const { createPostSchema, updatePostSchema } = require('../middlewares/validator');

exports.getPosts = async (req, res) => {
 const { page } = req.query;
 const postsPerPage = 10;
 
 try{
    let pageNum = 0;
    if(page > 1){
        pageNum = page - 1;
    }

     const result = await Post.find()
     .sort({ createdAt: -1 })
     .skip(pageNum * postsPerPage)
     .limit(postsPerPage)
     .populate({ path: 'userId', select: 'email'});

     res.status(200).json({ success: true, message: 'Posts récupérés', data: result })
 } catch(error) { 
  console.error(error);
  res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
}
};

exports.singlePost = async (req, res) => {
    const { postId } = req.query;
       try{
       const result = await Post.findById(postId).populate({ path: 'userId',select: 'email' });
       res.status(200).json({success: true, message: 'Post récupéré', data: result })   
   } catch(error){
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
  }
  };
exports.createPost = async (req,res) => {
    const { title, description } = req.body;
    const { userId } = req.user;

    try {
        const { error } = createPostSchema.validate({ title, description, userId});
        if (error) {
           return res .status(400).json({ success: false, message: error.details[0].message });
        }
     const request = await Post.create({ title, description, userId })
     res.status(201).json({ success: true, message: 'Créé', data: request })
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
};

exports.updatePost = async (req,res) => {
  const { postId } = req.params; 
  const { title, description } = req.body;
  const { userId } = req.user;

    try {
        const { error } = updatePostSchema.validate({ title, description });
        if (error) {
           return res.status(400).json({ success: false, message: error.details[0].message });    
        }
    
        const existingPost = await Post.findById(postId);
    if(!existingPost){
        return res.status(404).json({ success: false, message: 'Post non disponible' });
    }
    if (existingPost.userId.toString() !== userId) {
        return res.status(403).json({ success: false, message: 'Non autorisé' });
    }

    await Post.updateOne({ _id: postId }, { title, description });
    res.status(200).json({success: true, message:  'Post mis à jour avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur' }); 
    }
};

exports.deletePost = async (req, res) => {
    try {
      const { postId } = req.params;
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post non trouvé' });
      }
      if (post.userId.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Non autorisé à supprimer ce post' });
      }
      await Post.findByIdAndDelete(postId);
      res.json({ message: 'Post supprimé avec succès' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur lors de la suppression du post' });
    }
  };