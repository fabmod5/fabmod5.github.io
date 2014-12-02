function png_path(input,error,diameter,offset,overwrap,intensity){
    var Module = { //さきにModule作っちゃう
        input: input //pre.jsで読み込まれる
    };
    arguments = ["dummy_input","dummy_output",error,diameter,offset,overwrap,intensity];//こうしないとmain関数のargvとして読み込まれるので注意
