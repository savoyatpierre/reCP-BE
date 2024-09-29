require("dotenv").config();
const CryptoJS = require("crypto-js");
const User = require("../../models/User.js");
const Community = require("../../models/Community.js");

module.exports = adminGetDatabaseLoad = (req, res, next) => {

  console.log("admin.encryptdatabase");
  
  let outcome = {
		users: { state: "pending", passed: 0, failed: 0 },
		communities: { state: "pending", passed: 0, failed: 0 },
	}
  
  Promise.all([
	  User.find().then(users => {
		  console.log("# users", users.length);		  
		  let newUsers = []
		  // Mapping
		  users.forEach(user => {
			  let newUser = {...user._doc}
	      delete newUser.login;
	      delete newUser.name;
	      newUser.schema = "mig2410"
	      newUser.state = "active"
	      newUser.login = CryptoJS.AES.encrypt(
	        user.login,
	        process.env.ENCRYPTION_KEY
	      ).toString(CryptoJS.enc.Utf8)
	      newUser.name = CryptoJS.AES.encrypt(
	        user.name,
	        process.env.ENCRYPTION_KEY
	      ).toString(CryptoJS.enc.Utf8)			  
	      newUsers.push(newUser)
		  })
		  console.log("# newusers", newUsers.length);
		  // Update
		  let userAddPromises = []
		  newUsers.forEach(newUser => {
			  // Add a promise
			  userAddPromises.push(User.updateOne(
				  {userid: newUser.userid},
				  newUser
			  ).then(() => {
				  console.log("update user success", newUser.userid);
				  outcome.users.passed = outcome.users.passed + 1
			  }).catch((error) => {
				  console.log("update user error", newUser.userid, error);
				  outcome.users.failed = outcome.users.failed + 1
			  }))		
		  })
		  Promise.all(userAddPromises).then(() => {
				  console.log("update users success");
				  outcome.users.state = "done"
		  }).catch((error) => {
				  console.log("update users error", error);
				  outcome.users.state = "done"
				  outcome.users.error = error
		  });		
	  }),
	  Community.find().then(communities => {
		  console.log("# communities", communities.length);  
		  let newCommunities = []
		  // Mapping
		  communities.forEach(community => {
			  let newCommunity = {...community._doc}
	      delete newCommunity.name;
	      newCommunity.schema = "mig2410"
	      newCommunity.name = CryptoJS.AES.encrypt(
	        community.name,
	        process.env.ENCRYPTION_KEY
	      ).toString(CryptoJS.enc.Utf8)			  
	      newCommunities.push(newCommunity)
		  })
		  console.log("# newCommunities", newCommunities.length);
		  // Update
		  let communityAddPromises = []
		  newCommunities.forEach(newCommunity => {
			  // Add a promise
			  communityAddPromises.push(Community.updateOne(
				  {communityid: newCommunity.communityid},
				  newCommunity
			  ).then(() => {
				  console.log("update community success", newCommunity.communityid);
				  outcome.communities.passed = outcome.communities.passed + 1
			  }).catch((error) => {
				  console.log("update community error", newCommunity.communityid, error);
				  outcome.communities.failed = outcome.communities.failed + 1
			  }))	
		  })
		  Promise.all(userAddPromises).then(() => {
				  console.log("update communities success");
				  outcome.communities.state = "done"
		  }).catch((error) => {
				  console.log("update communities error", error);
				  outcome.communities.state = "done"
				  outcome.communities.error = error
			});			  
	  }),
  ]).then(() => {
	  console.log('admin.encryptdatabase.success', outcome);
		res.status(200).json({
			type: "admin.encryptdatabase.success",
			outcome: outcome,
		});
  }).catch((error) => {
		console.log('admin.encryptdatabase.error', error);
		res.status(400).json({
			type: "admin.encryptdatabase.error",
			error: error,
		});
	});	
}