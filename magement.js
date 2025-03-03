// console.log("hello");
// console.log("test");
// console.log("test2");
 
const honistry = async () => {
    let douet = false;
    if (douet) {
        return 'yes sir';  
    } else {
        throw 'no sir';  
    }
};

async function handleHonistry() {
    try {
        const result = await honistry();  
        console.log("Resolved:", result);
    } catch (error) {
        console.log("Rejected:", error);
    }
}

handleHonistry();
