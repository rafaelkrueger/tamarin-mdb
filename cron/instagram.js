const User = require("../models/Usuario");
const { IgApiClient } = require("instagram-private-api");
const { get } = require("request-promise");

const postStoriesEveryDay = async (req, res) => {
  User.find({})
    .then(async (response) => {
      for (const company of response) {
        try {
          if (
            company.social.instaUsername !== "vazio" ||
            company.social.instaPassword !== "vazio"
          ) {
            const ig = new IgApiClient();
            ig.state.generateDevice(company.social.instaUsername);
            await ig.account.login(
              company.social.instaUsername,
              company.social.instaPassword
            );
            const userId = await ig.user.getIdByUsername(
              company.social.instaUsername
            );

            const feed = ig.feed.user(userId);
            const posts = await feed.items();
            if (posts.length > 5) {
              for (let i = 0; i < 6; i++) {
                const post = posts[i];
                const imageUrl = post.image_versions2.candidates[0].url;
                const caption = post.caption;

                const imageBuffer = await get({
                  url: imageUrl,
                  encoding: null,
                });

                await ig.publish.story({
                  file: imageBuffer,
                  caption,
                });
                console.log(`Post ${i + 1} posted to stories`);
              }
            }
          }
          console.log(`${company.social.instaUsername} - stories posted`);
        } catch (err) {
          console.log(err);
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
  console.log("--------------------------");
  console.log("\n");
};

module.exports = {
  postStoriesEveryDay: postStoriesEveryDay,
};
