async function retrieveWorkoutImages(id) {  
    let workoutData = null;
    let response = await sendRequest("GET", `${HOST}/api/workouts/${id}/`);
    if (!response.ok) {
        let data = await response.json();
        let alert = createAlert("Could not retrieve workout data!", data);
        document.body.prepend(alert);
    } else {
        workoutData = await response.json();

        document.getElementById("workout-title").innerHTML = "Workout name: " + workoutData["name"];
        document.getElementById("workout-owner").innerHTML = "Owner: " + workoutData["owner_username"];

        let hasNoImages = workoutData.files.length == 0;
        let noImageText = document.querySelector("#no-images-text");

        if(hasNoImages){
            noImageText.classList.remove("hide");
            return;
        }

        noImageText.classList.add("hide");

        
        let filesDiv = document.getElementById("img-collection");
        let filesDeleteDiv = document.getElementById("img-collection-delete");
        
        const currentImageFileElement = document.querySelector("#current");
        let isFirstImg = true;

        let fileCounter = 0;

        for (let file of workoutData.files) {
            let a = document.createElement("a");
            a.href = file.file;
            let pathArray = file.file.split("/");
            a.text = pathArray[pathArray.length - 1];
            a.className = "me-2";

            

            let isImage = ["jpg", "png", "gif", "jpeg", "JPG", "PNG", "GIF", "JPEG"].includes(a.text.split(".")[1]);

            if(isImage){
                let deleteImgButton = document.createElement("input");
                deleteImgButton.type = "button";
                deleteImgButton.className = "btn btn-close";
                deleteImgButton.id = file.url.split("/")[file.url.split("/").length - 2];
                deleteImgButton.addEventListener('click', () => handleDeleteImgClick(deleteImgButton.id, "DELETE", `Could not delete workout ${deleteImgButton.id}!`, HOST, ["jpg", "png", "gif", "jpeg", "JPG", "PNG", "GIF", "JPEG"]));
                filesDeleteDiv.appendChild(deleteImgButton);
                
                let img = document.createElement("img");
                img.src = file.file;
                
                filesDiv.appendChild(img);
                deleteImgButton.style.left = `${(fileCounter % 4) * 191}px`;
                deleteImgButton.style.top = `${Math.floor(fileCounter / 4) * 105}px`;

                if(isFirstImg){
                    currentImageFileElement.src = file.file;
                    isFirstImg = false;
                }
                fileCounter++;
            }
        }

        const otherImageFileElements = document.querySelectorAll(".imgs img");
        const selectedOpacity = 0.6;
        otherImageFileElements[0].style.opacity = selectedOpacity;

        otherImageFileElements.forEach((imageFileElement) => imageFileElement.addEventListener("click", (event) => {
            //Changes the main image
            currentImageFileElement.src = event.target.src;

            //Adds the fade animation
            currentImageFileElement.classList.add('fade-in')
            setTimeout(() => currentImageFileElement.classList.remove('fade-in'), 500);

            //Sets the opacity of the selected image to 0.4
            otherImageFileElements.forEach((imageFileElement) => imageFileElement.style.opacity = 1)
            event.target.style.opacity = selectedOpacity;
        }))

    }
    return workoutData;     
}
