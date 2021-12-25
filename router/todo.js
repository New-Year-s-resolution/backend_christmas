const express = require("express")
const router = express.Router()
const Todo = require("../schemas/todos")
// const authMiddleware = require("../middlewares/auth-middleware")


router.get('/', async (req, res) => {
    console.log(" Show  todo list")

    try {
        const list = await Todo.find({})

        if (list) {
            res.status(200).json(list)
        }
        else {
            res.status(401).send("Wrong access")
        }
        // mapping to new item name   (ex userId , user_id)

    } catch (error) {
        res.status(401).send(error.message)
    }

});

router.post('/', authMiddleware, async (req, res) => {
    console.log(" Writing new todo")

    const { newContent } = req.body
    const { userId } = res.locals.user;

    console.log(userId)
    try {
        //const todoContent = { userId: 1, content: newContent }
        const newTodo = await Todo.create({ userId, content: newContent })
        res.status(200).json({ isCreated: true })
    } catch (error) {
        res.status(401).send(error.message)
    }

});

router.put("/:todoId", authMiddleware, async (req, res) => {
    console.log(" Updating todo ")
    const { todoId } = req.params
    const { newContent } = req.body
    const { userId } = res.locals.user;
    console.log(userId)
    const query = { todoId };
    try {
        await Todo.findByIdAndUpdate({ query, content: newContent })
        res.status(200).json({ isUpdated: true })
    } catch (error) {
        res.status(401).send(error.message)
    }
})



router.delete('/:todoId', authMiddleware, async function (req, res) {
    res.send("deleting todo")
    const { todoId } = req.params
    const { userId } = res.locals.user;
    console.log(userId)

    try {
        Todo.deleteOne({ todoId })
        res.status(200).json({ isDeleted: true })
    } catch (error) {
        res.status(401).send(error.message)
    }
});


module.exports = router