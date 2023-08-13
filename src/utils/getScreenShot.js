import domtoimage from "dom-to-image-more";

function capture() {
  var node = document.getElementById("cardId_12");

  domtoimage
    .toPng(node)
    .then(function (dataUrl) {
      var img = new Image();
      img.src = dataUrl;
      console.log("imge", img.src);
      //   document.body.appendChild(img);
    })
    .catch(function (error) {
      console.error("oops, something went wrong!", error);
    });
}
export { capture };
