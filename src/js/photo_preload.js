

export default function photoPreloadUrl(input, ctx) {
    if(!ctx) 
        return 0;

    let reader = new FileReader()
    reader.onload = e => ctx.$data.urlImg = e.target.result
    reader.readAsDataURL(input)
    ctx.$data.imgShow = true
} 