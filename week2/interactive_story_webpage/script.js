const gifElement = document.getElementById('phone-gif');
const initialGifSrc = gifElement.src; // Store the initial GIF source

document.getElementById('play-gif').addEventListener('click', function() {
    // Reload the GIF to start playing
    gifElement.src = initialGifSrc + '?t=' + new Date().getTime(); // Adding timestamp forces reload to play
});

document.getElementById('pause-gif').addEventListener('click', function() {
    // To "pause" the GIF, we'll take a snapshot of the current frame and replace the GIF with it.
    const gifUrl = gifElement.src;
    gifElement.src = ''; // Temporarily remove the GIF

    // Use the original image to pause (e.g., the first frame or a snapshot)
    // You can use a static image of the same scene from the GIF to simulate the pause.
    gifElement.src = 'snapshot-frame.png'; // Replace with the static snapshot of the GIF
});