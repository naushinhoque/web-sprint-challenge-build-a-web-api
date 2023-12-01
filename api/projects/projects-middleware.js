// add middlewares here related to projects
const projectsModel = require('./projects-model');

const validateProjectId = async (req, res, next) => {
    const existingProject = await projectsModel.get(req.params.id);
  
    if (!existingProject) {
      res.status(404).send('Invalid project ID');
      return;
    }
  
    next();
  };

  module.exports = {
    validateProjectId,
  }