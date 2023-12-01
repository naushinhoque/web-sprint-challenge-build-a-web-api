// add middlewares here related to actions
const actionsModel = require('../actions/actions-model');

const validateActionData = (req, res, next) => {
    const { description, notes, project_id } = req.body;
  
    if (!description || !notes || !project_id) {
      res.status(400).send('Missing required fields');
      return;
    }
  
    next();
  };