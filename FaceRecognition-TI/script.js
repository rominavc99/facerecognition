const imageUpload = document.getElementById('imageUpload')

Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUriv('/models'),
    faceapi.nets.ssMobilenetv1.loadFromUri('/models')
    .then(start)
])

async function start(){
    const container = document.createElement('div')
    container.style.position = 'relative'
    document.body.append(container)
    const labeledFaceDecriptors = await loadLabeledImagen
    const faceMatcher = faceapi.FaceMatcher(labeledFaceDecriptors, 0.6)
    let image
    let canvas
    document.body.append('Loaded')

    imageUpload.addEventListener('change', async () => {
        if (image) image.remove()
        if (canvas) canvas.remove()

        image = await faceapo.bufferToImage(imageUpload.file[0])
        container.append(image)
        canvas = faceapi.createCamvasFromMedia(image)

        const displaySize = {width: image.width, height: image.height}

        faceapi.matchDimentions(canvas, displaySize)

        const detections = await faceapi.detectAllFaces(image).withFaceLandMarks().withFaceDescriptors()
        const resizeDetections = faceapi.resizeResults(detections, displaySize)
        const results = resizeDetections.map(d => FaceMatcher.findBestMatch(d.descriptor))

        results.forEach((results, i =>{
            const box = resizeDetections[i].detection.box
            const drawBox = new faceapi.drawBox(box, {label: results.toString() })
            drawBox.draw(canvas)
        }))

    })
}

function loadLabeledImagen() {
    const labels = ['Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jime Rhodes', 'Thor', 'Tony Stark']
    return Promise.all(
        labels.map(async label =>{
            const descriptions = []
            for (let i = 1; i <= 2; i++) {

                const img = await faceapi.fetchImage(`http://mawe.mx/face/images/${label}/${i}.jpg`)
                const detections = await faceapi.detectionSingleFace(img).withFaceLandmarks().withFaceDescriptors()
                descriptions.push(detections.descriptor)

            }

            return new faceapi.labeledFaceDecriptors(label, detections)
            
        })
    )
}