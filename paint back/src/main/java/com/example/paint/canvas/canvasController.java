package com.example.paint.canvas;

import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class canvasController  {
    private final canvasService canvasService;

    @Autowired
    public canvasController(canvasService canvasService) {
        this.canvasService = canvasService;
    }

    @GetMapping("/canvasData/{name}")
    public String getCanvasData(@PathVariable String name) {
        return canvasService.getCanvasByName(name);
    }
    @DeleteMapping("/canvasData/{name}")
    public void deleteStudent(@PathVariable String name){
        canvasService.deleteCanvas(name);
    }
    @PostMapping("canvasData")
    public void addCanvas(@RequestBody JSONObject canvas){
        canvasService.addCanvas(canvas);
    }
    @GetMapping("/canvasData/names")
    public List<String> getCanvasNames() {
        return canvasService.getCanvasNames();
    }
}
