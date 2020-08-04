import { ImageCommands } from "../lib";

export const imageCommands: ImageCommands = [{
    name: "tweet",
    description: "Create a fake Donald Trump tweet",
    text: true,
    maxLength: 165,
    avSize: 128
},
{
    name: "fear",
    description: "Get the 'i fear no may but that thing..' meme with someone's avatar",
    avSize: 256,
    target: true,
},
{
    name: "garbage",
    description: "Tell someone they are full of trash",
    target: true,
    avSize: 512
},
{
    name: "color",
    description: "",
    colour: true,
    maxLength: 16,
    avSize: 128
},
{
    name: "crush",
    target: true,
    description: "Got a crush on someone?",
    avSize: 512
},
{
    name: "bobross",
    description: "Get Bob Ross painting someone's portait <3",
    avSize: 512,
    target: true
},
{
    name: "respect",
    description: "Pay your respects to someone",
    avSize: 128,
    target: true
},
{
    name: "truth",
    description: "Get the 'truth is under this paper' meme with someone's avatar",
    avSize: 256,
    target: true
},
{
    name: "tom",
    description: "Get the 'tom shooting himself' meme with someone's avatar",
    avSize: 256,
    target: true
},
{
    name: "sacred",
    description: "Get the sacred meme with someone's avatar",
    avSize: 512,
    target: true
},
{
    name: "religion",
    description: "Get the religion meme with someone's avatar",
    avSize: 512,
    target: true
},
{
    name: "picture",
    description: "Get the 'i love this picture' meme with someone's avatar",
    target: true,
    avSize: 1024
},
{
    name: "patrick",
    description: "Get the patrick screaming meme with someone's avatar",
    avSize: 512,
    target: true
},
{
    name: "painting",
    description: "Get the 'painting that kills' meme with someone's avatar",
    avSize: 512,
    target: true
},
{
    name: "mask",
    description: "Put a mask on goddammit",
    avSize: 512,
    target: true
},
{
    name: "achievement",
    description: "A minecraft achievement!",
    avSize: 64,
    text: true
},
{
    name: "beautiful",
    description: "Get the 'this is beautiful' with your avatar",
    avSize: 256,
    target: true
},
{
    name: "father",
    description: "Get an image of your dad shooting you because you said '<text>'",
    avSize: 256,
    text: true
},
{
    name: "dipshit",
    description: "Get an image correcting your Google search to 'dipshit'. *Did you mean: dipshit*",
    text: true,
    avSize: 128
},
{
    name: "delete",
    description: "Get the delete meme with somsone's avatar",
    avSize: 256,
    target: true
},
{
    name: "bed",
    description: "Call someone the monster under your bed",
    avSize: 128,
    target: true
}];