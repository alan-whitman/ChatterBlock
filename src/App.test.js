import reconcileReactions from './components/Dashboard/ChannelView/reconcileReactions';
import JSONtest from '../JSONtest';
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




describe('Reconcile Reactions Test', () => {

    test('it should return an array', () => {
        expect(Array.isArray(reconcileReactions(existingMessageReactions, existingMessages))).toBeTruthy();
    });

    test('elements in the array should be objects', () => {
        expect(typeof reconcileReactions(existingMessageReactions, existingMessages)[0]).toBe('object');
    });

    test('objects in the array should have a content_text property', () => {
        expect(reconcileReactions(existingMessageReactions, existingMessages)[0].hasOwnProperty('content_text')).toBeTruthy();
    })

    test('objects in the array should have a user_id property', () => {
        expect(reconcileReactions(existingMessageReactions, existingMessages)[0].hasOwnProperty('user_id')).toBeTruthy();
    })


    test('it should return expected results given certain inputs', () => {
        expect(JSON.stringify(reconcileReactions(existingMessageReactions, existingMessages), null, 4)).toBe(JSONtest);

    });

});
