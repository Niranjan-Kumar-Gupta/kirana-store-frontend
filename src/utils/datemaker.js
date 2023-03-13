export function getDate (timestamp){
    const time = new Date(timestamp).toLocaleString("en-IN",{
        dateStyle:"short",
        timeStyle:"short"
    });
    return time
}