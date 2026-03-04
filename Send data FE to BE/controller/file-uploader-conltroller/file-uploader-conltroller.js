
export async function fileUploaderConltroller(req, res) {
    try {
        // 400
        if (!req?.file) {
            return res?.status(400).send({
                status: false,
                message: "File is required or No file receoved"
            });
        };

        // 200
        return res?.status(200).send({
            status: true,
            message: 'File uploaded succesfully'
        });
    }

    catch (error) {
        // 500
        console.log(`Something went wrong while saving image: ${error}`);
        return res?.status(500).send({
            status: false,
            message: "Internal server error"
        });
    }
}