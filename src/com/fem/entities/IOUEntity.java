package com.fem.entities;

import com.google.apphosting.api.DatastorePb.GetResponse.Entity;


public class IOUEntity extends Entity {
	private int groupId;
	private String fromUserId;
	private String toUserId;
	private double amount; 

}
