import path from 'path';
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import express from "express";
import http from "http";
import cors from "cors";
import winston from "winston";

import { ccipGateway } from "./http/ccipGateway";
import { getConfigReader } from "./config/ConfigReader";

import resolverJson from '../deployments/goerli/ERC3668Resolver.json';

dotenv.config({ path: __dirname});

declare global {
    var logger: winston.Logger
}
  
global.logger = winston.createLogger({
    level: process.env.LOG_LEVEL ?? 'info',
    transports: [new winston.transports.Console()],
});

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.json());

(async () => {
    
    //const config = getConfigReader(process.env.CONFIG);

    app.locals.logger = winston.createLogger({
        transports: [new winston.transports.Console()],
    });

    const configString = JSON.stringify({
        [resolverJson["address"]]: {
            "type":          "optimism-bedrock",
            "handlerUrl":    "https://ens.unruggablegateway.com",
            "l1ProviderUrl": "https://eth-goerli.g.alchemy.com/v2/tUTlvOS8uBoP5SqTOlV91Hb3gaVTf816",
            "l2ProviderUrl": "https://opt-goerli.g.alchemy.com/v2/rTbd7myQ6pGvD1L4SEN171Sft4BG-uVZ",
            "l1chainId":     "5",
            "l2chainId":     "420"
        },
        "0x49e0AeC78ec0dF50852E99116E524a43bE91B789": {
            "type":          "optimism-bedrock",
            "handlerUrl":    "https://ens.unruggablegateway.com",
            "l1ProviderUrl": "https://eth-goerli.g.alchemy.com/v2/tUTlvOS8uBoP5SqTOlV91Hb3gaVTf816",
            "l2ProviderUrl": "https://opt-goerli.g.alchemy.com/v2/rTbd7myQ6pGvD1L4SEN171Sft4BG-uVZ",
            "l1chainId":     "5",
            "l2chainId":     "420"
        }
    });

    const config = getConfigReader(configString);

    app.use("/", ccipGateway(config));
})();
const port = process.env.PORT || "8081";
server.listen(port, () => {
    global.logger.info("[Server] listening at port " + port + " and dir " + __dirname);
});
