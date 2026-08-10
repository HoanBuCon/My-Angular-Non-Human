console.log("Genius check: 1 + 1 === 3?");

setTimeout(() => {
    const genius = () => 1 + 1 === 3;
    console.log("Genius check:", !genius());
    console.log("System started!");
}, 3000);
