import reconcileReactions from './src/components/Dashboard/ChannelView/reconcileReactions';
import JSONtest from './JSONtest';

describe('Reconcile Reactions Test', () => {
    test('it should return an array of messages with a reactions object', () => {
        const existingMessageReactions = [
            {
                channel_message_id: 693,
                reaction_name: "grin-tongue-squint",
                username: "test1"
            },
            {
                channel_message_id: 691,
                reaction_name: "meh",
                username: "test1"
            }
        ];
        const existingMessages = [
            {
                content_text: "test message",
                content_image: null,
                time_stamp: "1548277899943",
                user_id: 28,
                id: 691,
                username: "test1",
                user_image: ""
            },
            {
                content_text: "test message 2",
                content_image: null,
                time_stamp: "1548277905590",
                user_id: 28,
                id: 692,
                username: "test1",
                user_image: ""
            },
            {
                content_text: "test message 3",
                content_image: null,
                time_stamp: "1548277907552",
                user_id: 28,
                id: 693,
                username: "test1",
                user_image: ""
            }
        ];
        expect(JSON.stringify(reconcileReactions(existingMessageReactions, existingMessages), null, 4)).toBe(JSONtest);

    })
})