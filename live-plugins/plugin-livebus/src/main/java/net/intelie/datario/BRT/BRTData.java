package net.intelie.datario.BRT;

// Exemplo:
//"codigo":"86286","linha":0,"latitude":-22.87684166666666,"longitude":-43.463674999999988,"datahora":1476876980000,"velocidade":0

import net.intelie.datario.EventData;

public class BRTData extends EventData {
    private String codigo;
    private String linha;
    private double latitude;
    private double longitude;
    private long datahora;
    private String velocidade;

    public String getCode()
    {
        return codigo;
    }

    public String getLine()
    {
        return linha;
    }

    public double getLatitude()
    {
        return latitude;
    }

    public double getLongitude()
    {
        return longitude;
    }

    public long getTimestamp()
    {
        return datahora;
    }

    public String getSpeed()
    {
        return velocidade;
    }
}
