// Write your "projects" router here!
const express = require('express')
const projectsModel = require('../projects/projects-model')
const { validateProjectId } = require('./projects-middleware')

const router = express.Router()
// [GET] /api/projects
// Returns an array of projects as the body of the response.
// If there are no projects it responds with an empty array.
router.get('/', async (req, res) => {
    const projects = await projectsModel.get()
    res.json(projects)
})

//  [GET] /api/projects/:id
// Returns a project with the given id as the body of the response.
// If there is no project with the given id it responds with a status code 404.
router.get('/:id', validateProjectId, async (req, res) => {
    // const id = parseInt()
    const project = await projectsModel.get(req.params.id)

    if(!project) {
        res.status(404).send('Project not found')
        return
    }
    res.json(project)
})

//  [POST] /api/projects
// Returns the newly created project as the body of the response.
// If the request body is missing any of the required fields it responds with a status code 400.
        // router.post('/', async (req, res) => {
        //     const { name, description, completed } = req.body

        //     if (!name || !description) {
        //         res.status(400).send('Missing required fields')
        //         return
        //     }

        //     const newProject = await projectsModel.insert({
        //         name,
        //         description,
        //         completed,
        //     })
        //     res.json(newProject)
        // })
router.post('/', async (req, res) => {
    const { name, description, completed } = req.body;
          
    projectsModel.insert({
     name,
     description,
     completed,
    }).then(newProject => {
     res.status(201).json(newProject);
    }).catch(err => {
        if (!name || !description) {
         res.status(400).send('Project name already exists');
        } else {
        res.status(500).send('Internal server error');
        }
     });
 });

//  [PUT] /api/projects/:id
// Returns the updated project as the body of the response.
// If there is no project with the given id it responds with a status code 404.
// If the request body is missing any of the required fields it responds with a status code 400.
router.put('/:id', validateProjectId, async (req, res) => {
    const { name, description, completed } = req.body

    if (!name || !description || completed === undefined) {
        res.status(400).send('Missing required fields')
        return;
    }

    const updatedProject = await projectsModel.update(req.params.id, {
        name, 
        description, 
        completed,
    })

    if (!updatedProject) {
        res.status(404).send('Project not found')
        return
    }
    res.json(updatedProject)
})

//  [DELETE] /api/projects/:id
// Returns no response body.
// If there is no project with the given id it responds with a status code 404.
router.delete('/:id', validateProjectId, async (req, res) => {
    // const id = parseInt()
    const deletedCount = await projectsModel.remove(req.params.id)

    if (deletedCount === 0) {
        res.status(404).send('Project not found')
        return
    }
    res.status(204).send()
})

//  [GET] /api/projects/:id/actions
// Returns an array of actions (could be empty) belonging to a project with the given id.
// If there is no project with the given id it responds with a status code 404.
// Inside api/actions/actions-router.js build endpoints for performing CRUD operations on actions:
router.get('/:id/actions', validateProjectId, async (req, res) => {
    // const id = parseInt()
    const actions = await projectsModel.getProjectActions(req.params.id)
    res.json(actions)
})

module.exports = router