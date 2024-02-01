package com.example.paint.canvas;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Service
public class canvasService {
    private String filename = "canvas.json";
    private JSONArray canvases;
    private ObjectMapper objectMapper;


    public canvasService() throws IOException, ParseException {
        Object objc = new JSONParser().parse(new FileReader(this.filename));
        canvases = (JSONArray) objc;
        objectMapper = new ObjectMapper();
    }

    public String getCanvasByName (String name){
        for(int i = 0; i < canvases.size(); i++){
            Object canvas = canvases.get(i);
            JSONObject jsonCanvas = (JSONObject) canvas;
            if (jsonCanvas.get("name").equals(name))
                return (String) jsonCanvas.get("data");
        }
        return null;
    }
    public void deleteCanvas(String name){
        for(int i = 0; i < canvases.size(); i++){
            Object canvas = canvases.get(i);
            JSONObject jsonCanvas = (JSONObject) canvas;
            if (jsonCanvas.get("name").equals(name))
                canvases.remove(i);
        }
        try {
            objectMapper.writeValue(new File(this.filename), canvases);
//            JsonWriter writer = Json.createWriter(new FileOutputStream("sampleData"));
//            writer.writeArray(value);
//            writer.close();
//            Files.write(Paths.get(this.filename), canvases.toJSONString().getBytes());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void addCanvas(JSONObject canvas) {
        canvases.add(canvas);
        try {
            Files.write(Paths.get(this.filename), canvases.toJSONString().getBytes());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public List<String> getCanvasNames() {
        List<String> canvasNames = new ArrayList<String>();
        for(int i = 0; i < canvases.size(); i++){
            Object canvas = canvases.get(i);
            JSONObject jsonCanvas = (JSONObject) canvas;
            canvasNames.add((String) jsonCanvas.get("name"));
//            if (jsonCanvas.get("name").equals(name))
//                return (String) jsonCanvas.get("data");
        }
        return canvasNames;
    }
}
