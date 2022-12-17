const express = require("express");
const User = require("../models/Usuario");
const cloudinary = require("cloudinary").v2;

const setWebsiteStyle = async (req, res) => {
  try {
    const {
      empresa,
      websiteNavbarFooterColor,
      websiteFontFooterColor,
      websiteColor,
      websiteFontColor,
      websiteCarousel,
    } = req.body;
    const result = async () => {
      if (websiteCarousel.charAt(0) == "h") {
        return websiteCarousel;
      } else {
        const result = await cloudinary.uploader.upload(websiteCarousel, {
          folder: "samples",
          resource_type: "auto",
        });
        return result;
      }
    };
    const resultImage = await result();

    User.updateOne(
      { _id: empresa },
      {
        $set: {
          "website.websiteNavbarFooterColor": websiteNavbarFooterColor,
          "website.websiteFontFooterColor": websiteFontFooterColor,
          "website.websiteColor": websiteColor,
          "website.websiteFontColor": websiteFontColor,
          "website.websiteCarousel":
            websiteCarousel.charAt(0) == "h"
              ? resultImage
              : resultImage.secure_url,
        },
      }
    )
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  setWebsiteStyle,
};
