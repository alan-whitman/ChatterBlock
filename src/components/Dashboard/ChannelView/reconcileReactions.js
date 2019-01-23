const reconcileReactions = (existingMessageReactions, existingMessages) => {
    let messageReactions = {}
        existingMessageReactions.forEach(reaction => {
        if (!messageReactions[reaction.channel_message_id])
            messageReactions[reaction.channel_message_id] = {};
        if (!messageReactions[reaction.channel_message_id][reaction.reaction_name])
            messageReactions[reaction.channel_message_id][reaction.reaction_name] = [];
        messageReactions[reaction.channel_message_id][reaction.reaction_name].push(reaction.username);
    });
    existingMessages.forEach(message => {
        if (messageReactions[message.id])
            message.reactions = messageReactions[message.id];
    });
    return existingMessages;
}

export default reconcileReactions;