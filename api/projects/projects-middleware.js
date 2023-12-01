// add middlewares here related to projects
const projectsModel = require('../projects/projects-model');

const validateProjectId = async (req, res, next) => {
    const projectId = parseInt(req.params.projectId);
  
    const existingProject = await projectsModel.get(projectId);
  
    if (!existingProject) {
      res.status(404).send('Invalid project ID');
      return;
    }
  
    next();
  };