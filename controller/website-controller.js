const express = require("express");
const User = require("../models/Usuario");
const cloudinary = require("cloudinary").v2;

const setWebsiteAllStyle = async (req, res) => {
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

const setWebsiteCardStyle = async (req, res) => {
  try {
    const {
      empresa,
      websiteCardBackgroundColor,
      websiteCardFontColor,
      websiteDiscountColor,
      websitePriceColor,
      websiteHeartTagColor,
      websiteDiscountTagColor,
      websiteButton,
      websiteButtonFont,
    } = req.body;
    User.updateOne(
      { _id: empresa },
      {
        $set: {
          "website.websiteCardBackgroundColor": websiteCardBackgroundColor,
          "website.websiteCardFontColor": websiteCardFontColor,
          "website.websiteDiscountColor": websiteDiscountColor,
          "website.websitePriceColor": websitePriceColor,
          "website.websiteHeartTagColor": websiteHeartTagColor,
          "website.websiteDiscountTagColor": websiteDiscountTagColor,
          "website.websiteButton": websiteButton,
          "website.websiteButtonFont": websiteButtonFont,
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
  setWebsiteAllStyle,
  setWebsiteCardStyle,
};
