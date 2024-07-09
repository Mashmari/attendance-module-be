const Image = require('../models/imagedata');

// Create a new image record
exports.createImage = async (req, res) => {
  try {
    const {
      School_ID,
      Class_ID,
      User_ID,
      Ref_Image_filename,
      Ref_Image_filepath,
      Ref_Image_Create_DateTime,
      Ref_Image_Update_DateTime,
      Ref_Image_Update_Count,
      School_Location_ID,
      StudentName,
      Param1,
      Param2,
    } = req.body;
    
    const newImage = await Image.create({
      School_ID,
      Class_ID,
      User_ID,
      Ref_Image_filename,
      Ref_Image_filepath,
      Ref_Image_Create_DateTime,
      Ref_Image_Update_DateTime,
      Ref_Image_Update_Count,
      School_Location_ID,
      StudentName,
      Param1,
      Param2,
    });
    
    res.status(201).json(newImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all image records
exports.getAllImages = async (req, res) => {
  try {
    const images = await Image.findAll();
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get an image record by ID
exports.getImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findByPk(id);
    
    if (image) {
      res.status(200).json(image);
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an image record by ID
exports.updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      School_ID,
      Class_ID,
      User_ID,
      Ref_Image_filename,
      Ref_Image_filepath,
      Ref_Image_Create_DateTime,
      Ref_Image_Update_DateTime,
      Ref_Image_Update_Count,
      School_Location_ID,
      StudentName,
      Param1,
      Param2,
    } = req.body;
    
    const image = await Image.findByPk(id);
    
    if (image) {
      image.School_ID = School_ID;
      image.Class_ID = Class_ID;
      image.User_ID = User_ID;
      image.Ref_Image_filename = Ref_Image_filename;
      image.Ref_Image_filepath = Ref_Image_filepath;
      image.Ref_Image_Create_DateTime = Ref_Image_Create_DateTime;
      image.Ref_Image_Update_DateTime = Ref_Image_Update_DateTime;
      image.Ref_Image_Update_Count = Ref_Image_Update_Count;
      image.School_Location_ID = School_Location_ID;
      image.StudentName = StudentName;
      image.Param1 = Param1;
      image.Param2 = Param2;
      
      await image.save();
      res.status(200).json(image);
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an image record by ID
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findByPk(id);
    
    if (image) {
      await image.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};