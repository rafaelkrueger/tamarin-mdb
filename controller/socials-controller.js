const { IgApiClient } = require("instagram-private-api");
const { get } = require("request-promise");

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
  res.send("Unfollow was successful");
};

const postStoriesEveryMorning = async (req, res) => {
  const { username, password } = req.body;

  const ig = new IgApiClient();
  ig.state.generateDevice(username);
  await ig.account.login(username, password);

  // Get the user ID for the account
  const userId = await ig.user.getIdByUsername(username);

  // Get the last 6 posts from the user
  const feed = ig.feed.user(userId);
  const posts = await feed.items();

  // Post each post to the account's stories
  for (let i = 0; i < 6; i++) {
    const post = posts[i];
    const imageUrl = post.image_versions2.candidates[0].url;
    const caption = post.caption;

    //bglh de fazer buffer na image

    const imageBuffer = await get({
      url: imageUrl,
      encoding: null,
    });

    // Upload the image to the account's story
    await ig.publish.story({
      file: imageBuffer,
      caption,
    });
    console.log(`Post ${i + 1} posted to stories`);
  }
};

module.exports = {
  removeInstagramFollowers: removeInstagramFollowers,
  postStoriesEveryMorning: postStoriesEveryMorning,
};
