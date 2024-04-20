module.exports.handler = async function (event) {
    console.info(event);
    console.log("called");
    return event;
};
