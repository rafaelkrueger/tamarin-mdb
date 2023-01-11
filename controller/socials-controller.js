const { IgApiClient } = require("instagram-private-api");

const removeInstagramFollowers = async (req, res) => {
  const { username, password, userId } = req.body;
  const ig = new IgApiClient();
  ig.state.generateDevice(username);
  await ig.account.login(username, password);

  let followers = await ig.feed.accountFollowers(userId).request();
  let followingList = followers.users;
  const users = [];

  for (let i = 0; i < followingList.length; i++) {
    users.push(`${followingList[i].username}`);
  }

  for (let i = 0; i < 10; i++) {
    try {
      const id = await ig.user.getIdByUsername(users[i]);
      await ig.friendship.destroy(id);
      console.log(`Unfollowed user ${users[i]}.`);
    } catch (err) {
      console.error(`An error occurred: ${err.message}`);
    }
  }
};

module.exports = {
  removeInstagramFollowers: removeInstagramFollowers,
};
