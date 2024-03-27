import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
	try {
		

		const AllUsers = await User.find().select("-password");

		res.status(200).json(AllUsers);
	} catch (error) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
