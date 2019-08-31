module counter
  (input wire en,
   output reg [7:0] count,
   input            clk, rstf
   );

   always @(posedge clk or negedge rstf) begin
      if(~rstf)
        count <= 0;
      else
        if(en)
          count <= count + 1;
   end
endmodule
