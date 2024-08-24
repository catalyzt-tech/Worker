import { FastifyReply, FastifyRequest } from "fastify";
import { importedModules } from "..";



export async function TriggerModule(request: FastifyRequest<{ Params: { scriptName: string } }>, reply: FastifyReply) {
    const { scriptName } = request.params;

    const { password } = request.body as { password: unknown };

    if (!password || typeof password !== 'string') {
        reply.status(401).send({
            msg: "error",
            data: "Unauthorized password is required"
        });
    } else if (password !== process.env.API_PASSWORD) {
        reply.status(400).send({
            msg: "error",
            data: "Password doesn't match"
        });
    }
    

    if (importedModules[scriptName] && typeof importedModules[scriptName].Run === 'function') {
        try {
            await importedModules[scriptName].Run();
            reply.status(200).send({
                msg: "ok",
                data: `Successfully ran ${scriptName}`,
            });
        } catch (error) {
            reply.status(500).send({
                msg: "error",
                data: `Error running ${scriptName}: ${error}`
            });
        }
    } else {
        reply.status(404).send({
            msg: "error",
            data: `Script ${scriptName} not found or doesn't have a Run function`
        });
    }
};