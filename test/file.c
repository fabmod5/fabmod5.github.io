#include <stdio.h>
#include <stdlib.h>

int main(void){
    FILE *fp = fopen("output","w");
    if(fp==NULL){
        printf("file open error\n");
        exit(-1);
    }
    /* char s[256]; */
    /* while(fgets(s,256,fp)==NULL){ */
    /*     fprintf(" */
    /* } */
    fprintf(fp,"hogehoge");
    fclose(fp);

    return 0;
}

