import React, { useState, useEffect } from "react";

export default function Meme() {
    const [meme, setMeme] = useState({
        topText: "",
        bottomText: "",
        randomImage: "http://i.imgflip.com/1bij.jpg"
    });
    const [allMemes, setAllMemes] = useState([]);

    useEffect(() => {
        async function getMemes() {
            try {
                const res = await fetch("https://api.imgflip.com/get_memes");
                const data = await res.json();
                setAllMemes(data.data.memes);
            } catch (error) {
                console.error("Failed to fetch memes:", error);
            }
        }
        getMemes();
    }, []);
    
    function getMemeImage() {
        const randomNumber = Math.floor(Math.random() * allMemes.length);
        const url = allMemes[randomNumber].url;
        setMeme(prevMeme => ({
            ...prevMeme,
            randomImage: url,
            topText: "",   
            bottomText: "" 
        }));
    }
    
    function handleChange(event) {
        const { name, value } = event.target;
        setMeme(prevMeme => ({
            ...prevMeme,
            [name]: value
        }));
    }
    
    function saveAndDownload() {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const image = new Image();
        image.src = meme.randomImage;
        image.crossOrigin = "Anonymous"; 

        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;

            ctx.drawImage(image, 0, 0);

            ctx.font = "bold 40px Impact";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 5;

            ctx.strokeText(meme.topText, canvas.width / 2, 10);
            ctx.fillText(meme.topText, canvas.width / 2, 10);

            ctx.textBaseline = "bottom";
            ctx.strokeText(meme.bottomText, canvas.width / 2, canvas.height - 10);
            ctx.fillText(meme.bottomText, canvas.width / 2, canvas.height - 10);

            const dataURL = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = dataURL;
            link.download = "meme.png";
            link.click();
        };

        image.onerror = () => {
            console.error("Failed to load image. Ensure CORS settings are correct.");
        };
    }

    return (
        <main>
            <div className="form">
                <input 
                    type="text"
                    placeholder="Top text"
                    className="form--input"
                    name="topText"
                    value={meme.topText}
                    onChange={handleChange}
                />
                <input 
                    type="text"
                    placeholder="Bottom text"
                    className="form--input"
                    name="bottomText"
                    value={meme.bottomText}
                    onChange={handleChange}
                />
                <button 
                    className="form--button"
                    onClick={getMemeImage}
                >
                    New Meme Image
                </button>
            </div>
            <div className="meme">
                <img src={meme.randomImage} className="meme--image" alt="Meme" />
                <h2 className="meme--text top">{meme.topText}</h2>
                <h2 className="meme--text bottom">{meme.bottomText}</h2>
            </div>

            <button
                className="save--button"
                onClick={saveAndDownload}
            >
                Save and Download
            </button>
        </main>
    );
}
