const notFound = (req,res) => {
    res.status(404).json({message : "not found page here"})
}

module.exports = notFound