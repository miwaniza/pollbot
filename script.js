let currentImageId = null;


const getNextImage = () => {
  $.ajax({
    url: "/next-image",
    method: "GET",
    success: (data) => {
      if (data.endOfImages) {
        $("#container").html("<h2>All images have been rated</h2>");
        $("#actions").hide();
      } else {
        $("#image").attr("src", data.imageUrl);
        $("#description").text(data.description);
        currentImageId = data.id;
      }
    },
  });
};

const postReaction = (reaction) => {
  if (currentImageId) {
    $.ajax({
      url: "/reaction",
      method: "POST",
      data: {
        imageId: currentImageId,
        reaction: reaction,
      },
      success: () => {
        getNextImage();
      },
    });
  } else {
    getNextImage();
  }
};

$(document).ready(() => {
  getNextImage();

  $("#like").click(() => {
    postReaction("like");
  });

  $("#skip").click(() => {
    postReaction("skip");
  });

  $("#dislike").click(() => {
    postReaction("dislike");
  });
});