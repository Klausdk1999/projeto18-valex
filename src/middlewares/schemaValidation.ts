const validateSchema = (schema) => {
    
    return (req,res,next) => {
        const body =  req.body;
        const validation =  schema.validate(body, {abortEarly: false});
        
        if(validation.error){
            const details = validation.error.details;
            console.log(details)
            const errors = details.map(details => {
                const erro = details.path
                const message = details.message.split(" ").splice(1).join(" ");
                return {[erro]: message}
            })
            if(details[0].type===("string.uri")){
                return res.status(422).send(errors);
            }
            return res.status(400).send(errors);
        };
        next();
    }
};

export default validateSchema;