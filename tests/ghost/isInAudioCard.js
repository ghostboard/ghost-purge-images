require('dotenv').config();
const expect = require('chai').expect;
const isInAudioCard = require('../../lib/ghost/isInAudioCard');

describe('lib/ghost/isInAudioCard', () => {

    it('should be available', () => {
        expect(isInAudioCard).to.be.a('function');
    });

    it('should return TRUE when some is used in a audio card', () => {
        let error;
        let output;
        try {
            const mobiledoc = '{"version":"0.3.1","atoms":[],"cards":[["audio",{"loop":false,"src":"http://localhost:2368/content/media/2021/12/file_example_MP3_900KB.mp3","title":"File example MP3 700KB","duration":27.252,"mimeType":"audio/mpeg"}],["audio",{"loop":false,"src":"http://localhost:2368/content/media/2021/12/file_example_MP3_700KB.mp3","title":"File example MP3 700KB","duration":27.252,"mimeType":"audio/mpeg"}],["video",{"loop":false,"src":"http://localhost:2368/content/media/2021/12/file_example_MP4_640_3MG.mp4","fileName":"file_example_MP4_640_3MG.mp4","width":640,"height":360,"duration":30.526667,"mimeType":"video/mp4","thumbnailSrc":"http://localhost:2368/content/images/2021/12/media-thumbnail-ember182.jpg","thumbnailWidth":640,"thumbnailHeight":360}]],"markups":[],"sections":[[1,"p",[[0,[],0,"whatever"]]],[10,0],[10,1],[1,"p",[]]],"ghostVersion":"4.0"}';
            const upload = {
                path: 'content/media/2021/12/file_example_MP3_700KB.mp3'
            };
            output = isInAudioCard(upload, mobiledoc);
        } catch (err) {
            error = err;
        } finally {
            expect(error).to.be.undefined;
            expect(output).to.equal(true);
        }
    });

    it('should return FALSE for a full patch check, not only filename', () => {
        let error;
        let output;
        try {
            const mobiledoc = '{"version":"0.3.1","atoms":[],"cards":[["audio",{"loop":false,"src":"http://localhost:2368/content/media/2021/12/file_example_MP3_700KB.mp3","title":"File example MP3 700KB","duration":27.252,"mimeType":"audio/mpeg"}],["video",{"loop":false,"src":"http://localhost:2368/content/media/2021/12/file_example_MP4_640_3MG.mp4","fileName":"file_example_MP4_640_3MG.mp4","width":640,"height":360,"duration":30.526667,"mimeType":"video/mp4","thumbnailSrc":"http://localhost:2368/content/images/2021/12/media-thumbnail-ember182.jpg","thumbnailWidth":640,"thumbnailHeight":360}]],"markups":[],"sections":[[1,"p",[[0,[],0,"whatever"]]],[10,0],[10,1],[1,"p",[]]],"ghostVersion":"4.0"}';
            const upload = {
                path: 'content/media/2019/12/file_example_MP3_700KB.mp3'
            };
            output = isInAudioCard(upload, mobiledoc);
        } catch (err) {
            error = err;
        } finally {
            expect(error).to.be.undefined;
            expect(output).to.equal(false);
        }
    });

    it('should return FALSE when a uploaded file is not used in audio', () => {
        let error;
        let output;
        try {
            const mobiledoc = '{"version":"0.3.1","atoms":[],"cards":[["audio",{"loop":false,"src":"http://localhost:2368/content/media/2021/12/file_example_MP3_700KB.mp3","title":"File example MP3 700KB","duration":27.252,"mimeType":"audio/mpeg"}],["video",{"loop":false,"src":"http://localhost:2368/content/media/2021/12/file_example_MP4_640_3MG.mp4","fileName":"file_example_MP4_640_3MG.mp4","width":640,"height":360,"duration":30.526667,"mimeType":"video/mp4","thumbnailSrc":"http://localhost:2368/content/images/2021/12/media-thumbnail-ember182.jpg","thumbnailWidth":640,"thumbnailHeight":360}]],"markups":[],"sections":[[1,"p",[[0,[],0,"whatever"]]],[10,0],[10,1],[1,"p",[]]],"ghostVersion":"4.0"}';
            const upload = {
                path: 'content/media/2019/12/not_used.mp3'
            };
            output = isInAudioCard(upload, mobiledoc);
        } catch (err) {
            error = err;
        } finally {
            expect(error).to.be.undefined;
            expect(output).to.equal(false);
        }
    });
});
