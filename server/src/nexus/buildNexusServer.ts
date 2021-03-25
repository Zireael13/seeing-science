import { objectType, asNexusMethod, } from "@nexus/schema"
import {makeSchema} from 'nexus'
import { addCrudResolvers } from '@ra-data-prisma/backend'
import { nexusSchemaPrisma } from 'nexus-plugin-prisma/schema'
import { createContext } from "../context"
import {Express} from 'express'
import { PrismaClient } from "@prisma/client"
import { ApolloServer } from "apollo-server-express"
import { User } from "./schema/User"
import { drtTrialResponse } from "./schema/DRT"



export const buildNexusServer = async (app: Express, prisma: PrismaClient): Promise<void> => {

    const schema = makeSchema({
        types: [
            User,
            addCrudResolvers("User"),
            drtTrialResponse,
            addCrudResolvers("DrtTrialResponse")
        ],
        plugins: [
            nexusSchemaPrisma({
                experimentalCRUD: true, // required!
                paginationStrategy: "prisma", // required!
    //   outputs: {
    //     typegen: typegenPath("./generated/nexus-prisma.ts")
    //   }
            })
        ]
    })

    const apolloSrv = new ApolloServer({
        context: (exp) => createContext(exp, prisma),
        uploads: false,
        schema,
      })
      // TODO: CORS
    apolloSrv.applyMiddleware({app, cors: {origin: "http://localhost:3000"}, path: "/admingql"})


}