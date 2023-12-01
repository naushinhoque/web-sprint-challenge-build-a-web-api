// Write your "actions" router here!
const actionsModel = require('../actions/actions-model');
const projectsModel = require('../projects/projects-model');
const validateActionData = require('./actions-middlware');

const router = express.Router();

// [GET] /api/actions
// Returns an array of actions (or an empty array) as the body of the response.
router.get('/', async (req, res) => {
    const actions = await actionsModel.get();
    res.json(actions);
});

//  [GET] /api/actions/:id
// Returns an action with the given id as the body of the response.
// If there is no action with the given id it responds with a status code 404.
router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const action = await actionsModel.get(id);

    if (!action) {
        res.status(404).send('Action not found');
        return;
    }
    res.json(action);
});

//  [POST] /api/actions
// Returns the newly created action as the body of the response.
// If the request body is missing any of the required fields it responds with a status code 400.
// When adding an action make sure the project_id provided belongs to an existing project.
router.post('/', validateActionData, async (req, res) => {
    const { description, notes, project_id, completed } = req.body;

    if (!description || !notes || !project_id) {
        res.status(400).send('Missing required fields');
        return;
    }

    const existingProject = await projectsModel.get(project_id);

    if (!existingProject) {
        res.status(400).send('Invalid projec_id');
        return;
    }

    const newAction = await actionsModel.insert({
        description,
        notes,
        project_id,
        completed,
    });

    res.json(newAction);
});

//  [PUT] /api/actions/:id
// Returns the updated action as the body of the response.
// If there is no action with the given id it responds with a status code 404.
// If the request body is missing any of the required fields it responds with a status code 400.
router.put('/:id', validateActionData, async (req, res) => {
    const id = parseInt(req.params.id);
    const { description, notes, project_id, completed } = req.body;

    if (!description || !notes || !project_id) {
        res.status(400).send('Missing required fields');
        return;
    }

    const existingProject = await projectsModel.get(project_id);

    if (!existingProject) {
        res.status(400).send('Invalid projec_id');
        return;
    }

    const updatedAction = await actionsModel.insert(id, {
        description,
        notes,
        project_id,
        completed,
    });

    if (!updatedAction) {
        res.status(404).send('Action not found');
    }

    res.json(updatedAction);
})

//  [DELETE] /api/actions/:id
// Returns no response body.
// If there is no action with the given id it responds with a status code 404.
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const deletedCount = await actionsModel.remove(id);

    if (deletedCount === 0) {
        res.status(404).send('Action not found');
        return;
    }

    res.status(204).send();
});

module.exports = router;