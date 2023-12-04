import s from "./Editor.module.scss";
import {FC, memo, useCallback, useRef} from "react";

// tools.js
// @ts-ignore
import Embed from "@editorjs/embed";
// @ts-ignore
import Table from "@editorjs/table";
// @ts-ignore
import List from "@editorjs/list";
// @ts-ignore
import Warning from "@editorjs/warning";
// @ts-ignore
import Code from "@editorjs/code";
// @ts-ignore
import LinkTool from "@editorjs/link";
// @ts-ignore
import Image from "@editorjs/image";
// @ts-ignore
import Raw from "@editorjs/raw";
// @ts-ignore
import Header from "@editorjs/header";
// @ts-ignore
import Quote from "@editorjs/quote";
// @ts-ignore
import Marker from "@editorjs/marker";
// @ts-ignore
import CheckList from "@editorjs/checklist";
// @ts-ignore
import Delimiter from "@editorjs/delimiter";
// @ts-ignore
import InlineCode from "@editorjs/inline-code";
// @ts-ignore
import SimpleImage from "@editorjs/simple-image";
import {createReactEditorJS} from "react-editor-js";
import {useMutation} from "react-query";
import {addNewImageInTest} from "../../../api/uploadImage";
import axios from "axios";
import {API_URL, API_URL_IMAGES} from "../../../http";


interface EditorProps {
    data: any;
    setData: any;
}

const Editor: FC<EditorProps> = ({ data, setData }) => {
    const editorCore = useRef(null);
    const {
        mutateAsync: addNewImageTrigger,
    } = useMutation(addNewImageInTest)

    const ReactEditorJS = createReactEditorJS();

    const handleInitialize = useCallback((instance: any) => {
        // await instance._editorJS.isReady;
        instance._editorJS.isReady
            .then(() => {
                // set reference to editor
                editorCore.current = instance;
            })
            .catch((err: any) => console.log("An error occured", err));
    }, []);

    const handleSave = useCallback(async () => {
        // retrieve data inserted
        // @ts-ignore
        const savedData = await editorCore.current.save();
        // save data
        setData(savedData);
    }, [setData]);

    return (
        <div className="text-container">
            <div className="editor-container">
                <ReactEditorJS
                    onInitialize={handleInitialize}
                    tools={{
                        embed: Embed,
                        table: Table,
                        list: List,
                        warning: Warning,
                        code: Code,
                        linkTool: LinkTool,
                        // image: Image,
                        image: {
                            class: Image,
                            config: {
                                uploader: {
                                    async uploadByFile(file: any) {
                                        const formData = new FormData();
                                        formData.append('file', file);

                                        const response = await axios.post('http://localhost:6007/api/uploadImage/create', formData, {
                                            headers: {
                                                'Content-Type': 'multipart/form-data'
                                            },
                                            withCredentials: true
                                        })

                                        if (response.data.success === 1) {
                                            return {
                                                success: 1,
                                                file: {
                                                    url: API_URL_IMAGES + '/images/' + response.data.fileId
                                                }
                                            };
                                        }
                                    }
                                }
                            }
                        },
                        raw: Raw,
                        header: Header,
                        quote: Quote,
                        marker: Marker,
                        checklist: CheckList,
                        delimiter: Delimiter,
                        inlineCode: InlineCode,
                        simpleImage: SimpleImage
                    }}
                    onChange={handleSave}
                    defaultValue={data}
                />
            </div>
        </div>
    );
};

export default memo(Editor);
