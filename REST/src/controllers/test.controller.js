// Test controller 
const testController = async (req, res) => {
    return res.status(200)
    .json({ 
        status: "success",
        message: "Yeah It works!!!!"
    });
};

export { testController };